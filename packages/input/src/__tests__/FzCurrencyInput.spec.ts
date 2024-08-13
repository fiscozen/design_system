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

        await wrapper.find('input').setValue(val)
        expect(wrapper.props('modelValue')).toBe('1234,56')
    })
});
