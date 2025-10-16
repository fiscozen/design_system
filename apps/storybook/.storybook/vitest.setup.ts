import { beforeAll } from 'vitest'
import { setProjectAnnotations } from '@storybook/vue3-vite'
import * as projectAnnotations from './preview'

// Applica le configurazioni globali di Storybook per i test
const project = setProjectAnnotations([projectAnnotations])

beforeAll(project.beforeAll)

