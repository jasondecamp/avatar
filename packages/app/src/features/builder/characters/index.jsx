import { human } from './human';
import { werewolf } from './werewolf';
import { zombie } from './zombie';
import { vampire } from './vampire';

export const characters = {
  [human.label]:    human,
  [werewolf.label]: werewolf,
  [zombie.label]:   zombie,
  [vampire.label]:  vampire,
};
