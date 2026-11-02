import { buildStageOpData } from '../src/server/lib/stageOp.js';

const stage = (zoneId, extra = {}) => ({
  stageType: 'MAIN',
  difficulty: 'NORMAL',
  zoneId,
  code: 'x',
  name: 'n',
  apCost: 6,
  diamondOnceDrop: 1,
  ...extra,
});

const tables = {
  stageTable: {
    stages: {
      'main_01-07': stage('main_1', { code: '1-7' }),
      'main_01-07#f#': stage('main_1', { code: '1-7', difficulty: 'FOUR_STAR' }),
      'main_01-08': stage('main_1', { code: '1-8' }),
      'easy_01-01': stage('main_1', { diamondOnceDrop: 0 }), // no OP: left out
      'tough_15-01': stage('act2mainss_zone1', { code: '15-2' }),
      'main_15-01': stage('act2mainss_zone1', { code: '15-2' }),
      tr_26: stage('act2mainss_zone1', { code: 'TR-26', apCost: 0 }),
      wk_melee_1: stage('weekly_9', { stageType: 'DAILY', code: 'CE-1' }),
      act9d0_01: stage('act9d0_zone1', { stageType: 'ACTIVITY', code: 'DM-1' }),
      act42side_01: stage('act42side_zone1', { stageType: 'ACTIVITY', code: 'TMT-1' }),
      act10d5_01: stage('act10d5_zone1', { stageType: 'ACTIVITY', code: 'CU-1' }),
      camp_01: stage('camp_1', { stageType: 'CAMPAIGN', diamondOnceDrop: 0 }),
    },
  },
  zoneTable: {
    zones: {
      main_1: {
        zoneID: 'main_1',
        type: 'MAINLINE',
        zoneNameFirst: 'Episode 1',
        zoneNameSecond: 'Evil Time Part 2',
      },
      act2mainss_zone1: {
        zoneID: 'act2mainss_zone1',
        type: 'MAINLINE_ACTIVITY',
        zoneNameFirst: 'Dissociative Recombination',
        zoneNameSecond: 'Dissociative Recombination',
      },
    },
  },
  activityTable: {
    basicInfo: {
      act42side: { id: 'act42side', name: "The Masses' Travels", startTime: 100, endTime: 200 },
      act42sre: {
        id: 'act42sre',
        name: "The Masses' Travels - Rerun",
        startTime: 1000,
        endTime: 2000,
      },
      act10d5: { id: 'act10d5', name: 'Children of Ursus', startTime: 10, endTime: 20 },
      act9d0: { id: 'act9d0', name: 'Darknights Memoir', startTime: 5, endTime: 6 },
    },
    zoneToActivity: {
      act42side_zone1: 'act42side',
      act10d5_zone1: 'act10d5',
      act9d0_zone1: 'act9d0',
    },
  },
  retroTable: {
    retroActList: {
      permanent_sub_1: {
        retroId: 'permanent_sub_1',
        type: 'BRANCHLINE',
        name: 'Darknights Memoir',
        index: 1,
      },
    },
    stageList: { act9d0_01: { zoneId: 'permanent_sub_1_zone1' } },
    zoneToRetro: { permanent_sub_1_zone1: 'permanent_sub_1' },
  },
};

describe('buildStageOpData', () => {
  const { groups } = buildStageOpData(tables);
  const byId = Object.fromEntries(groups.map((g) => [g.id, g]));

  test('groups main stages by episode, harder modes after the standard ones', () => {
    expect(byId.episode_1.name).toBe('Episode 1: Evil Time Part 2');
    expect(byId.episode_1.stages.map((s) => [s.id, s.mode])).toEqual([
      ['main_01-07', 'standard'],
      ['main_01-08', 'standard'],
      ['main_01-07#f#', 'challenge'],
    ]);
  });

  test('puts episodes 15+ (their own launch zones) and training stages in their episode', () => {
    expect(byId.episode_15.name).toBe('Episode 15: Dissociative Recombination');
    expect(byId.episode_15.stages.map((s) => [s.id, s.mode, s.ap])).toEqual([
      ['main_15-01', 'standard', 6],
      ['tr_26', 'standard', 0],
      ['tough_15-01', 'adverse', 6],
    ]);
  });

  test('archived events are permanent groups, not events', () => {
    expect(byId.permanent_sub_1).toMatchObject({ kind: 'intermezzi', name: 'Darknights Memoir' });
    expect(byId.permanent_sub_1.stages.map((s) => s.id)).toEqual(['act9d0_01']);
    expect(byId.act9d0).toBeUndefined();
  });

  test("an event takes its latest run's times, rerun included, newest first", () => {
    const events = groups.filter((g) => g.kind === 'event');
    expect(events.map((g) => [g.name, g.startTime, g.endTime])).toEqual([
      ["The Masses' Travels", 1000, 2000],
      ['Children of Ursus', 10, 20],
    ]);
  });

  test('supply stages, and nothing without Originite Prime', () => {
    expect(byId.supply.stages.map((s) => s.code)).toEqual(['CE-1']);
    const all = groups.flatMap((g) => g.stages.map((s) => s.id));
    expect(all).not.toContain('easy_01-01');
    expect(all).not.toContain('camp_01');
  });
});
