import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FzProgressBar from '../FzProgressBar.vue'

describe('FzProgressBar', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      expect(wrapper.html()).toContain('fz-progress-bar')
      expect(wrapper.html()).toContain('fz-progress-bar__progress-indicator')
    })

    it('matches snapshot with default props', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with size sm', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          size: 'sm',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with size md', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          size: 'md',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with 0% progress', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 0,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with 100% progress', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 100,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with custom range', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 30,
          min: -15,
          max: 50,
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with custom name', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          name: 'upload-progress',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders progress bar container with correct classes', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('w-full')
      expect(container.classes()).toContain('h-[20px]')
      expect(container.classes()).toContain('rounded-[4px]')
      expect(container.classes()).toContain('bg-grey-100')
    })

    it('renders with default size md (20px height)', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.classes()).toContain('h-[20px]')
      expect(container.classes()).not.toContain('h-[8px]')
    })

    it('renders with size sm (8px height)', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          size: 'sm',
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.classes()).toContain('h-[8px]')
      expect(container.classes()).not.toContain('h-[20px]')
    })

    it('renders with size md (20px height)', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          size: 'md',
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.classes()).toContain('h-[20px]')
      expect(container.classes()).not.toContain('h-[8px]')
    })

    it('renders progress fill with correct classes', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.exists()).toBe(true)
      expect(fill.classes()).toContain('h-full')
      expect(fill.classes()).toContain('rounded-[4px]')
      expect(fill.classes()).toContain('bg-purple-500')
      expect(fill.classes()).toContain('transition-all')
      expect(fill.classes()).toContain('duration-300')
    })

    it('renders with default color purple', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-purple-500')
    })

    it('renders with color blue', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'blue',
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-blue-500')
    })

    it('renders with color orange', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'orange',
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-orange-500')
    })

    it('renders with color pink', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'pink',
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-pink-500')
    })

    it('renders with color yellow', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'yellow',
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-yellow-500')
    })

    it('renders with color grey', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'grey',
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-grey-500')
    })

    it('matches snapshot with color purple', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'purple',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with color blue', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'blue',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with color orange', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'orange',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with color pink', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'pink',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with color yellow', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'yellow',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with color grey', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'grey',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot with size sm and color blue', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 75,
          size: 'sm',
          color: 'blue',
        },
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('Progress Calculation', () => {
    it('calculates 50% progress correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 50%')
    })

    it('calculates 0% progress correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 0,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('calculates 100% progress correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 100,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 100%')
    })

    it('calculates progress with custom range correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 30,
          min: -15,
          max: 50,
        },
      })

      // (30 - (-15)) / (50 - (-15)) * 100 = 45/65 * 100 ≈ 69%
      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 69%')
    })

    it('calculates progress with negative min correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 0,
          min: -25,
          max: 75,
        },
      })

      // (0 - (-25)) / (75 - (-25)) * 100 = 25/100 * 100 = 25%
      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 25%')
    })

    it('clamps progress to 0% when current is below min', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: -10,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('clamps progress to 100% when current is above max', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 150,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 100%')
    })

    it('handles range of 0 correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: 100,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })
  })

  describe('Accessibility', () => {
    it('has role="progressbar" attribute', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('role')).toBe('progressbar')
    })

    it('has aria-valuenow with current value', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 75,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuenow')).toBe('75')
    })

    it('has aria-valuemin with min value', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: 10,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemin')).toBe('10')
    })

    it('has aria-valuemax with max value', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          max: 200,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemax')).toBe('200')
    })

    it('has aria-label with name prop', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          name: 'custom-progress',
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-label')).toBe('custom-progress')
    })

    it('has default aria-label when name not provided', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-label')).toBe('progress-bar')
    })

    it('has all ARIA attributes for complete accessibility', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 30,
          min: -15,
          max: 50,
          name: 'download-progress',
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('role')).toBe('progressbar')
      expect(container.attributes('aria-valuenow')).toBe('30')
      expect(container.attributes('aria-valuemin')).toBe('-15')
      expect(container.attributes('aria-valuemax')).toBe('50')
      expect(container.attributes('aria-label')).toBe('download-progress')
    })
  })

  describe('Props', () => {
    it('uses default min value of 0', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemin')).toBe('0')
    })

    it('uses default max value of 100', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemax')).toBe('100')
    })

    it('accepts custom min value', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: -50,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemin')).toBe('-50')
    })

    it('accepts custom max value', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          max: 200,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemax')).toBe('200')
    })

    it('accepts custom name prop', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          name: 'upload-progress',
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-label')).toBe('upload-progress')
    })

    it('uses default color value of purple', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-purple-500')
    })

    it('accepts custom color prop', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          color: 'blue',
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      expect(fill.classes()).toContain('bg-blue-500')
      expect(fill.classes()).not.toContain('bg-purple-500')
    })
  })

  describe('Edge Cases', () => {
    it('handles zero range correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: 100,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
      
      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuenow')).toBe('50')
      expect(container.attributes('aria-valuemin')).toBe('100')
      expect(container.attributes('aria-valuemax')).toBe('100')
    })

    it('handles negative current value', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: -10,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('handles current value equal to min', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 0,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('handles current value equal to max', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 100,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 100%')
    })

    it('handles very large range', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 5000,
          min: 0,
          max: 10000,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 50%')
    })

    it('handles decimal values correctly', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 33.33,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      // 33.33% should round to 33%
      expect(style).toContain('width: 33%')
    })

    it('handles NaN values gracefully', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: NaN,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('sanitizes aria-valuenow when current is NaN', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: NaN,
          min: 0,
          max: 100,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuenow')).toBe('0')
    })

    it('handles Infinity values gracefully', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: Infinity,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('sanitizes aria-valuenow when current is Infinity', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: Infinity,
          min: 0,
          max: 100,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuenow')).toBe('0')
    })

    it('sanitizes aria-valuenow when current is -Infinity', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: -Infinity,
          min: 0,
          max: 100,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuenow')).toBe('0')
    })

    it('handles -Infinity values gracefully', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: -Infinity,
          min: 0,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('handles NaN in min/max values gracefully', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: NaN,
          max: 100,
        },
      })

      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })

    it('sanitizes aria-valuemin when min is NaN', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: NaN,
          max: 100,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemin')).toBe('0')
    })

    it('sanitizes aria-valuemax when max is NaN', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: 0,
          max: NaN,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemax')).toBe('0')
    })

    it('sanitizes aria-valuemin when min is Infinity', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: Infinity,
          max: 100,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemin')).toBe('0')
    })

    it('sanitizes aria-valuemax when max is Infinity', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: 50,
          min: 0,
          max: Infinity,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuemax')).toBe('0')
    })

    it('sanitizes all ARIA attributes when multiple values are invalid', () => {
      const wrapper = mount(FzProgressBar, {
        props: {
          current: NaN,
          min: Infinity,
          max: -Infinity,
        },
      })

      const container = wrapper.find('.fz-progress-bar')
      expect(container.attributes('aria-valuenow')).toBe('0')
      expect(container.attributes('aria-valuemin')).toBe('0')
      expect(container.attributes('aria-valuemax')).toBe('0')
      
      const fill = wrapper.find('.fz-progress-bar__progress-indicator')
      const style = fill.attributes('style')
      expect(style).toContain('width: 0%')
    })
  })
})

