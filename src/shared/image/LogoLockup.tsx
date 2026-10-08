type Props = {
    className?: string;
};

/** Horizontal lockup (fur head + wordmark) for tablet+ header. */
export const LogoLockup = ({ className }: Props) => (
    <img
        className={className}
        src="/brand/logo/jobmeerkat-lockup-horizontal-fur-on-dark.svg"
        width={177}
        height={32}
        alt=""
        aria-hidden="true"
        decoding="async"
    />
);
