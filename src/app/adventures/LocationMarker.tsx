import { useEffect, useState, memo } from 'react';

const LocationMarker = (
  { locationName, selected, markerList, index }:
  { locationName: string;
    selected: boolean;
    markerList: google.maps.marker.AdvancedMarkerView[];
    index: number;
  }
) => {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    // note: can access any marker properties in here to customize markers with markerList[index]
    // this useEffect is running after the initial markers have been drawn, this only runs when a marker has been selected/deselected
    if (!markerList[index]) {
      return;
    }
    if (selected || hover) {
      markerList[index].zIndex = 200;
    } else {
      markerList[index].zIndex = 100 - index;
    }
  }, [index, markerList, selected, hover]);

  return (
    <div
      onMouseOver={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
      className={`
        ${ selected
          ? 'bg-skyPrimary-700 text-yellowAccent-100'
          : 'bg-yellowAccent-100 text-skyPrimary-700'
        } text-base font-semibold shadow-[0_4px_8px_rgba(0,0,0,0.3)] p-2 rounded-lg
      `}
    >
      { (selected || hover)
        ? `${(index + 1)}. ${locationName}`
        : index + 1}
    </div>
  );
};

export const LocationMarkerMemo = memo(LocationMarker);