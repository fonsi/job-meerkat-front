'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import styled from 'styled-components';

/** Softened from https://www.frontend.fyi/tutorials/css-3d-perspective-animations */
const TILT_STRENGTH = 4;

/** Root used by consumers for `[data-tilting] &` face styles. */
export const HomeTiltRoot = styled.div`
    --x-rotation: 0deg;
    --y-rotation: 0deg;
    --glare-x: 42%;
    --glare-y: 18%;
    --glare-angle: 125deg;
    --glare-strength: 0;

    height: 100%;
    position: relative;

    /* Only promote a compositor layer while actively tilting — permanent
       will-change/perspective on every card blanks content during scroll. */
    @media (hover: hover) and (pointer: fine) {
        transform-style: preserve-3d;
        transition: transform 0.2s ease-out;

        &[data-tilting='true'] {
            transform: perspective(800px) rotateX(var(--x-rotation))
                rotateY(var(--y-rotation)) scale(1.01);
            transition: transform 0.05s linear;
            will-change: transform;
            z-index: 2;
        }
    }
`;

const Glare = styled.div`
    display: none;

    @media (hover: hover) and (pointer: fine) {
        background:
            radial-gradient(
                ellipse 110% 75% at var(--glare-x) var(--glare-y),
                rgba(255, 255, 255, calc(0.09 * var(--glare-strength))) 0%,
                rgba(214, 255, 63, calc(0.065 * var(--glare-strength))) 26%,
                transparent 64%
            ),
            linear-gradient(
                var(--glare-angle),
                transparent 32%,
                rgba(214, 255, 63, calc(0.04 * var(--glare-strength))) 46%,
                rgba(255, 255, 255, calc(0.07 * var(--glare-strength))) 50%,
                rgba(214, 255, 63, calc(0.04 * var(--glare-strength))) 54%,
                transparent 68%
            ),
            radial-gradient(
                ellipse 130% 65% at 50% -8%,
                rgba(214, 255, 63, calc(0.05 * var(--glare-strength))) 0%,
                transparent 52%
            );
        border-radius: 4px;
        display: block;
        inset: 0;
        mix-blend-mode: screen;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        transition: opacity 0.25s ease;
        z-index: 2;

        ${HomeTiltRoot}[data-tilting='true'] & {
            opacity: 1;
        }
    }
`;

type Props = {
    children: ReactNode;
    className?: string;
};

export const HomeTiltCard = ({ children, className }: Props) => {
    const boundingRef = useRef<DOMRect | null>(null);

    const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
        boundingRef.current = event.currentTarget.getBoundingClientRect();
    };

    const onMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
        boundingRef.current = null;
        event.currentTarget.removeAttribute('data-tilting');
        event.currentTarget.style.setProperty('--x-rotation', '0deg');
        event.currentTarget.style.setProperty('--y-rotation', '0deg');
        event.currentTarget.style.setProperty('--glare-x', '42%');
        event.currentTarget.style.setProperty('--glare-y', '18%');
        event.currentTarget.style.setProperty('--glare-angle', '125deg');
        event.currentTarget.style.setProperty('--glare-strength', '0');
    };

    const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!boundingRef.current) {
            boundingRef.current = event.currentTarget.getBoundingClientRect();
        }

        const x = event.clientX - boundingRef.current.left;
        const y = event.clientY - boundingRef.current.top;
        const xPercentage = x / boundingRef.current.width;
        const yPercentage = y / boundingRef.current.height;
        const px = xPercentage - 0.5;
        const py = yPercentage - 0.5;
        const xRotation = px * TILT_STRENGTH;
        const yRotation = -py * TILT_STRENGTH;

        // Overhead-left key light; specular drifts opposite the raised edge
        const lightX = -0.22;
        const lightY = -0.4;
        const glareX = (0.5 - px * 0.7 + lightX * 0.35) * 100;
        const glareY = (0.5 - py * 0.7 + lightY * 0.35) * 100;
        const glareAngle =
            Math.atan2(glareY / 100 - 0.5, glareX / 100 - 0.5) *
                (180 / Math.PI) +
            90;
        const distance = Math.hypot(px, py);
        const glareStrength = Math.min(1, distance * 1.65 + 0.15);

        event.currentTarget.setAttribute('data-tilting', 'true');
        event.currentTarget.style.setProperty(
            '--x-rotation',
            `${yRotation}deg`,
        );
        event.currentTarget.style.setProperty(
            '--y-rotation',
            `${xRotation}deg`,
        );
        event.currentTarget.style.setProperty('--glare-x', `${glareX}%`);
        event.currentTarget.style.setProperty('--glare-y', `${glareY}%`);
        event.currentTarget.style.setProperty(
            '--glare-angle',
            `${glareAngle}deg`,
        );
        event.currentTarget.style.setProperty(
            '--glare-strength',
            `${glareStrength}`,
        );
    };

    return (
        <HomeTiltRoot
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
        >
            {children}
            <Glare aria-hidden="true" />
        </HomeTiltRoot>
    );
};
