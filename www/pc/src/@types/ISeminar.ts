interface ISeminar extends IParty, Retrieve {}

interface IPayedSeminar extends ISeminar {
    eval_point: number;
    is_eval: boolean;
    is_party_cancel: boolean;
    region: string;
    status: string;
}