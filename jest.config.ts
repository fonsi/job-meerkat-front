import type { Config } from 'jest';

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/jest.css.mock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: '<rootDir>/tsconfig.json',
            },
        ],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@tanstack/react-start|@tanstack/start-client-core)/)',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
};

export default config;
