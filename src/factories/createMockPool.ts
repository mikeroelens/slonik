import {
  Logger,
} from '../Logger';
import {
  bindPool,
} from '../binders/bindPool';
import {
  poolStateMap,
} from '../state';
import type {
  ClientConfigurationInputType,
  DatabasePoolType,
  MockPoolOverridesType,
} from '../types';
import {
  createUid,
} from '../utilities';
import {
  createClientConfiguration,
} from './createClientConfiguration';

export const createMockPool = (
  overrides: MockPoolOverridesType,
  clientConfigurationInput?: ClientConfigurationInputType,
): DatabasePoolType => {
  const clientConfiguration = createClientConfiguration(clientConfigurationInput);

  const poolId = createUid();

  const poolLog = Logger.child({
    poolId,
  });

  const pool = {
    connect: () => {
      const connection = {
        off: () => {},
        on: () => {},
        query: overrides.query,
        release: () => {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      return connection;
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  poolStateMap.set(pool, {
    ended: false,
    mock: true,
    poolId,
    typeOverrides: null,
  });

  return bindPool(
    poolLog,
    pool,
    clientConfiguration,
  );
};
