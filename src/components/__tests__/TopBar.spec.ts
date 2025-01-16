import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TopBar from '@/components/TopBar.vue';
import UtilityService from '@/services/UtilityService';
import MyGlobal from '../../__tests__/_Globals.spec';

vi.mock('@/services/UtilityService');
UtilityService.Alert = vi.fn();
UtilityService.Confirm = vi.fn().mockResolvedValue({ isConfirmed: true });

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('TorBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('當 點選使用者時沒有FB名稱或沒有Google名稱 會 直接回傳不做', () => {
    const wrapper = mount(TopBar, { global: MyGlobal });
    (wrapper.vm as unknown as { IsAccountDialogOpen: boolean }).IsAccountDialogOpen = false;

    (
      wrapper.vm as unknown as {
        ClickUserIcon: () => void;
      }
    ).ClickUserIcon();

    expect((wrapper.vm as unknown as { IsAccountDialogOpen: boolean }).IsAccountDialogOpen).toBeFalsy();
  });

  it('當 點選使用者時 會 打開帳號資訊對話框', () => {
    const wrapper = mount(TopBar, { global: MyGlobal });
    (wrapper.vm as unknown as { IsAccountDialogOpen: boolean }).IsAccountDialogOpen = false;
    (wrapper.vm as unknown as { User: { FBName: string; GoogleName: string } }).User = { FBName: 'fakeFBName', GoogleName: 'fakeGoogleName' };

    (
      wrapper.vm as unknown as {
        ClickUserIcon: () => void;
      }
    ).ClickUserIcon();

    expect((wrapper.vm as unknown as { IsAccountDialogOpen: boolean }).IsAccountDialogOpen).toBeTruthy();
  });

  it('當 登出時 會 清空使用者資訊', async () => {
    const wrapper = mount(TopBar, { global: MyGlobal });
    (wrapper.vm as unknown as { User: { FBName: string; GoogleName: string } }).User = { FBName: 'fakeFBName', GoogleName: 'fakeGoogleName' };
    (
      wrapper.vm as unknown as {
        Logout: () => void;
      }
    ).Logout();
    await flushPromises();

    expect((wrapper.vm as unknown as { User: { FBName: string; GoogleName: string } }).User).toStrictEqual({
      FBEmail: '',
      FBName: '',
      FBPicture: '',
      GoogleEmail: '',
      GoogleName: '',
      GooglePicture: '',
    });
  });
});
