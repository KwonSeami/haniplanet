import {avatarExposeType} from '../avatar';
import {staticUrl} from '../../constants/env';

describe('Avatar Test', () => {
  it.each([
    [
      'real',
      '',
      staticUrl('/static/images/icon/icon-default-profile.png')
    ],
    [
      'real',
      'images/profile.png',
      'images/profile.png'
    ],
    [
      'nick',
      '',
      staticUrl('/static/images/icon/icon-default-nickname.png')
    ],
    [
      'anon',
      '',
      staticUrl('/static/images/icon/icon-default-anony.png')
    ],
    [
      '',
      '',
      staticUrl('/static/images/icon/icon-default-profile.png')
    ]
  ])('각 파라미터가 %p, %p 일 때 %p를 반환해야 한다.', (user_expose_type: string, avatar: string, expected: string) => {
    expect(avatarExposeType(user_expose_type, avatar)).toBe(expected);
  })
})