import { jest } from '@jest/globals'

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock Three.js Vector3 for tests
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  Mesh: jest.fn(),
}))

// Mock React Three Fiber hooks
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}))