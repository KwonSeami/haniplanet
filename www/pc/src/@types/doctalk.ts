interface IDocTalkFaq {
  category: string;
  region: string;
  age_and_gender: string;
  disease: string;
  question_title: string; 
  question_body: string;
  answer: string;
  tag_ids: ITag[];
  created_at?: string;
  updated_at?: string;
  kin_url: string;
  source_url: string;
  answered_at: string;
  asked_at: string;
  id?: HashId;
}