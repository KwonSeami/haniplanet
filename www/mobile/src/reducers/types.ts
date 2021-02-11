export interface IdOfPopup {
  id: string;
}
export type PopupPayload = IdOfPopup & {
  Popup: any;
  href: string;
  props: any;
  child: any;
};
export type PopupState = PopupPayload[];
