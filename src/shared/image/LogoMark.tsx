type Props = {
    className?: string;
};

/** Fur head mark (primary brand icon) for the topbar. */
export const LogoMark = ({ className }: Props) => (
    <img
        className={className}
        src="/brand/logo/jobmeerkat-logo-fur.svg"
        width={32}
        height={32}
        alt=""
        aria-hidden="true"
        decoding="async"
    />
);
