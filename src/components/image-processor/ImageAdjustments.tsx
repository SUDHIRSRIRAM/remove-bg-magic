import { Slider } from "../ui/slider";
import { Label } from "../ui/label";

interface ImageAdjustmentsProps {
  brightness: number;
  contrast: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
}

export const ImageAdjustments = ({
  brightness,
  contrast,
  onBrightnessChange,
  onContrastChange,
}: ImageAdjustmentsProps) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label>Brightness: {brightness}%</Label>
        <Slider
          value={[brightness]}
          onValueChange={(values) => onBrightnessChange(values[0])}
          min={0}
          max={200}
          step={1}
        />
      </div>
      <div className="space-y-2">
        <Label>Contrast: {contrast}%</Label>
        <Slider
          value={[contrast]}
          onValueChange={(values) => onContrastChange(values[0])}
          min={0}
          max={200}
          step={1}
        />
      </div>
    </div>
  );
};