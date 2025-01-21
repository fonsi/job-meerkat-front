import { Tracker } from '../tracker';

type WindowWithUmami = Window & {
    umami: {
        track: (event: string, data?: Record<string, unknown>) => void;
    };
};

export const umamiTracker: Tracker = {
    trackEvent: ({ event, data }) => {
        const win = window as unknown as WindowWithUmami;

        if (data) {
            win.umami.track(event, data);

            return;
        }

        win.umami.track(event);
    },
};
