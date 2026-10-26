import CSS from './styles/Stage.module.scss';

// Stage is the transparent canvas behind the avatar. All layer images are rendered by
// CarouselRow components positioned above it at their respective z-indexes.
export const Stage = () => <div className={CSS.stage} />;
