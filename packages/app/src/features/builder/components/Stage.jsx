import CSS from './styles/Stage.module.scss';

// Stage is the white background canvas. All layer images are rendered by
// CarouselRow components positioned above it at their respective z-indexes.
export const Stage = () => <div className={CSS.stage} />;
