import { FzTooltipStatus } from "@fiscozen/tooltip";
import type { IconVariant } from "@fiscozen/icons";

export type FzRadioProps = {
  /**
   * The label of the radio button
   */
  label: string;
  /**
   * The value of the radio button. Defaults to the label if not provided
   */
  value?: string;
  /**
   * Value of the currently selected value
   */
  modelValue?: string;
  /**
   * Whether the radio button is checked
   * @deprecated Use v-model instead
   */
  checked?: boolean;
  /**
   * If true, no label will be rendered
   * @deprecated Use hasText instead (hasText={false} is equivalent to standalone={true})
   */
  standalone?: boolean;
  /**
   * The size of the radio button
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Radio buttons now have a fixed size equivalent to the former "md" size.
   */
  size?: "sm" | "md";
  /**
   * The tone/variant of the radio button
   */
  tone?: "neutral" | "emphasis" | "error";
  /**
   * If true, the radio button will be emphasized
   * @deprecated Use tone="emphasis" instead
   */
  emphasis?: boolean;
  /**
   * If true, the radio button will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the radio button will be in an error state
   * @deprecated Use tone="error" instead
   */
  error?: boolean;
  /**
   * Text to display in the tooltip when hasIconRight is true
   */
  tooltip?: string;
  /**
   * Status of the tooltip (determines color and icon)
   */
  tooltipStatus?: FzTooltipStatus;
  /**
   * Controls visibility of the label text. If false, only the radio icon is shown.
   * Note: standalone={true} is equivalent to hasText={false}
   */
  hasText?: boolean;
  /**
   * the name of the radio button group to which the radio button belongs
   */
  name?: string;
  /**
   * If the radio button is required
   */
  required?: boolean;
};

export type FzRadioGroupProps = {
  /**
   * The label of the radio button group
   */
  label?: string;
  /**
   * The size of the radio button
   */
  size?: "sm" | "md";
  /**
   * Layout variant: vertical stacks radio buttons, horizontal arranges them in a row
   */
  variant?: "vertical" | "horizontal";
  /**
   * The tone/variant of the radio buttons
   */
  tone?: "neutral" | "emphasis" | "error";
  /**
   * If true, the radio button will be emphasized
   * @deprecated Use tone="emphasis" instead
   */
  emphasis?: boolean;
  /**
   * If true, the radio button will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the radio button will be in an error state
   * @deprecated Use tone="error" instead
   */
  error?: boolean;
  /**
   * the name of the radio button group to which the radio button belongs
   */
  name?: string;
  /**
   * If the radio button is required
   */
  required?: boolean;
};

export type FzRadioSharedProps = {};

export type FzRadioCardProps = FzRadioProps & {
  orientation?: "horizontal" | "vertical";
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  tooltip?: string;
  /**
   * Controls whether the radio icon is shown
   * @deprecated Use hasRadio instead
   */
  radioIcon?: boolean | ((props: FzRadioCardProps) => boolean);
  /**
   * Controls whether the radio icon is shown
   */
  hasRadio?: boolean;
};

/**
 * Decorative colour family of an icon tile.
 *
 * Maps onto the `@fiscozen/style` semantic token families, so a tile's colour
 * carries the same meaning it carries everywhere else in the DS.
 *
 * This is deliberately *not* the radio family's `tone` prop: `tone` describes
 * the validation state of a control (and `FzRadioGroup` spreads it down to every
 * child through `radioGroupProps`), while `accent` describes what the tile
 * stands for. Both can be set at once — an error-state group of coloured tiles.
 */
export type FzRadioIconTileAccent = "neutral" | "success" | "warning" | "error";

/**
 * Props for the FzRadioIconTile component.
 *
 * A single-select tile whose whole content is one icon: full height, full column
 * width, icon centred, colour by accent.
 *
 * `label` is inherited from `FzRadioProps` and stays **required**: the tile
 * renders no visible text, so the label is the only accessible name the option
 * has. Colour and icon alone do not distinguish the options.
 */
export type FzRadioIconTileProps = Omit<
  FzRadioProps,
  "hasText" | "standalone" | "tooltip" | "tooltipStatus" | "checked"
> & {
  /**
   * FontAwesome icon name rendered at the centre of the tile.
   * Must exist in the `@awesome.me/kit-8137893ad3` kit.
   */
  iconName: string;
  /**
   * FontAwesome icon variant
   * @default 'far'
   */
  iconVariant?: IconVariant;
  /**
   * Decorative colour family of the tile: tints the icon, and the border and
   * background of the selected state.
   * @default 'neutral'
   */
  accent?: FzRadioIconTileAccent;
};
