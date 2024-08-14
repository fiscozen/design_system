import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { FzCurrencyInput } from "..";

describe.concurrent("FzCurrencyInput", () => {
    it('renders floating numbers as currency', async () => {
        const val = 1234.56

        const wrapper = mount(FzCurrencyInput, {
            props: {
                label: "Label",
                modelValue: val,
                'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e})
            },
        });

        const inputElement = wrapper.find('input')
        await inputElement.setValue(val)
        await inputElement.trigger('blur')
        expect(inputElement.element.value).toBe('1.234,56')
    })
    it('should not allow inputs other than digits and separators', async () => {
        const wrapper = mount(FzCurrencyInput, {
            props: {
                label: "Label",
                'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e})
            },
        });

        const inputElement = wrapper.find('input')
        await inputElement.setValue('as12.3')
        await inputElement.trigger('input')
        expect(inputElement.element.value).toBe('12.3')
        await inputElement.trigger('blur')
        expect(inputElement.element.value).toBe('12,30')
    })
});
