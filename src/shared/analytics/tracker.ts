import { isProd } from '../environment/isProd';
import { consoleTracker } from './console/consoleTracker';
import { umamiTracker } from './umami/umamiTracker';

type TrackEventData = {
    event: string;
    data?: Record<string, unknown>;
};

export type Tracker = {
    trackEvent: (data: TrackEventData) => void;
};

export const tracker: Tracker = isProd ? umamiTracker : consoleTracker;
