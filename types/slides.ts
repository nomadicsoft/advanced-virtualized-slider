import {
  type BackgroundColor as BackgroundColorType,
  type SliderTransition as SliderTransitionType,
} from "@/enums/slider";

export interface SlideType {
  name: string | number;
  imgSrc: string | null;
  text: string | null;
  backgroundColor: null | BackgroundColorType;
}

export interface SliderSettingsType {
  arrows: boolean;
  transition: SliderTransitionType | null;
  transitionDuration: number | string;
  infinite: boolean;
  autoplay: boolean;
  autoplayDuration: number | string;
  vertical: boolean;
  swipeable: boolean;
}
