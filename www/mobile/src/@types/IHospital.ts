import {HashId} from '@hanii/planet-types';

interface IHospitalBase {
    id: number;
    image: string;
    name: string;
}

interface IHospitalRegistered extends IHospitalBase {
    address: string;
    telephone: string;
    updated_at?: string;
}

export interface IHospitalMember {
    user: {
        id: HashId;
        name: string;
        avatar: string;
        briefs: Array<IProfileBrief>;
        educations: Array<IProfileEdu>;
        thesis: Array<IProfileThesis>;
    };
    subject_text: string;
    position: string;
    subject_list: Array<string>;
    self_introduce: string;
}

interface IDayOfWeek extends IDateRange {
    id: Id;
    hospital: Id;
}

interface IHospital extends IHospitalBase {
    address: string;
    telephone: string;
    location_x: number;
    location_y: number;
    text: string;
    link: string;
    no_accept_text: string;
    reservation_text: string;
    etc: string;
    subject_text: string;
    expertise: string;
    day_of_week: [IDayOfWeek];
    files: [IFile];
    members: IHospitalMember[];
}


