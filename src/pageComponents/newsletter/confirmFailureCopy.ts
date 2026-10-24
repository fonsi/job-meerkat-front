/** Copy for a failed confirm: an expired link reads differently from a broken one. */
export const confirmFailureCopy = (
    error: string,
): { title: string; text: string } =>
    error === 'token_expired'
        ? {
              title: 'Confirmation link expired',
              text: 'Confirmation links work for 7 days. Enter your email and we’ll send you a fresh one.',
          }
        : {
              title: 'This confirmation link doesn’t work',
              text: 'It may be incomplete, or a newer email replaced it. Enter your email and we’ll send you a new link.',
          };
