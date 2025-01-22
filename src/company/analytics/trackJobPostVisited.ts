import { tracker } from '@/shared/analytics/tracker';

const ADD_COMPANY_BUTTON_WAS_CLICKED_EVENT = 'add-company-button-was-clicked';

export const trackAddCompanyButtonWasClicked = (): void => {
    tracker.trackEvent({
        event: ADD_COMPANY_BUTTON_WAS_CLICKED_EVENT,
    });
};
