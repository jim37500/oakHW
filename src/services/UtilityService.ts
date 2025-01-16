import type { SweetAlertIcon } from "sweetalert2";
import Swal from 'sweetalert2';

export default class UtilityService {
  // 提示訊息
  static Alert(title:string, icon = 'info', timer = 1000) {
    return Swal.fire({ title, icon: icon as SweetAlertIcon, timer });
  }

  // 確認對話框
  static Confirm(title: string, text?: string) {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    });
  }
}
