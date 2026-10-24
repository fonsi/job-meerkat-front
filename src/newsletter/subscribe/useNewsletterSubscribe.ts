import { FormEvent, useState } from 'react';
import { subscribeNewsletter } from '@/newsletter/http/newsletterApi';

type Options = {
    /** Runs after a successful subscribe, before the success state shows. */
    onSuccess?: () => void;
};

/** Shared state for the popup, inline card and landing page forms. */
export const useNewsletterSubscribe = ({ onSuccess }: Options = {}) => {
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [failed, setFailed] = useState(false);

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setFailed(false);

        try {
            await subscribeNewsletter(email.trim(), honeypot);
            onSuccess?.();
            setSubmitted(true);
        } catch {
            // Keep the typed email so retrying is one click.
            setFailed(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        honeypot,
        setHoneypot,
        loading,
        submitted,
        failed,
        onSubmit,
    };
};
