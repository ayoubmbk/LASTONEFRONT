import { Situation } from "./Situation.model";
import { Phase } from "./phase.model";

export interface Tache {
  idTache: number;
  status: string;
  nivTache: string;
  nomTache: string;
  user: string;
  Situation: Situation;
  dateCreation: Date;
}
