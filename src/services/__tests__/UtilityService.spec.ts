import { describe, vi, it, expect } from 'vitest';
import Swal from 'sweetalert2';
import UtilityService from '../UtilityService';

vi.mock('sweetalert2', () => {
  return {
    __esModule: true,
    default: {
      fire: vi.fn(() => {}),
    },
  };
});

describe('UtilityService', () => {
  it('當 呼叫提示訊息時 會 跳出提示訊息', () => {
    Swal.fire = vi.fn();
    UtilityService.Alert('title');

    expect(Swal.fire).toHaveBeenCalledWith({ title: 'title', icon: 'info', timer: 1000 });
  });

  it('當 呼叫確認對話框時 會 跳出確認對話框', () => {
    Swal.fire = vi.fn();
    UtilityService.Confirm('title', 'text');

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'question',
      title: 'title',
      text: 'text',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    });
  });
});
