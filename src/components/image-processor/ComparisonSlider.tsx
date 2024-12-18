import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface ComparisonSliderProps {
  originalImage: string;
  processedImage: string;
}

export const ComparisonSlider = ({ originalImage, processedImage }: ComparisonSliderProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={originalImage} alt="Original" />}
        itemTwo={<ReactCompareSliderImage src={processedImage} alt="Processed" />}
        position={50}
        className="h-full"
      />
    </div>
  );
};