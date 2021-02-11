interface IdAndTitleAtKey<T extends IdAndTitle = IdAndTitle> {
    [key: string]: T;
}

type IHospitalType = IdAndTitleAtKey;
type ICareerType = IdAndTitleAtKey;
type IEduType = IdAndTitleAtKey;

type IJobType = IdAndTitleAtKey<
    IdAndTitle & {
        employ_type: string;
    }
>;

interface IRegion extends HasId {
    name: string;
}
