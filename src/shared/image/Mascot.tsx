export type MascotPose = 'sad' | 'sleeping';

type Props = {
    pose: MascotPose;
    className?: string;
    alt?: string;
    width?: number;
    height?: number;
};

/** Brand mascot M1 pose — used on empty/404 surfaces only. */
export const Mascot = ({ pose, className, alt = '', width, height }: Props) => (
    <img
        className={className}
        src={`/brand/mascot/m1-${pose}.svg`}
        width={width}
        height={height}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        decoding="async"
    />
);
