import { useRef } from 'react';
import { throttle } from './useThrottle'

const usePushNotification = () => {
  const notificationRef = useRef(null);

  if (Notification.permission !== 'granted') {
    try {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') return;
      });
    } catch (error) {
      if (error instanceof TypeError) {
        Notification.requestPermission((permission) => {
          if (permission !== 'granted') return;
        });
      } else {
        console.error(error);
      }
    }
  }
  
  const setNotificationClickEvent = () => {
    notificationRef.current.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notificationRef.current.close();
    };
  };  
  /**************** 위에 작성한 코드까지는 위에 설명해놨음! ****************/

  // Notification을 위한 타이머를 설정하는 함수!
  const setNotificationTimer = (timeout) => {
    throttle(() => {
      notificationRef.current.close();
      notificationRef.current = null;
    }, timeout);
  };

  // 어떤 알림을 보낼 것인지, 몇 초마다 알림을 보낼 것인지에 대한 함수
  const fireNotificationWithTimeout = (title, timeout, options = {}) => {
    // 만약 유저가 푸시 알림을 꺼놓았다면 함수가 실행되지 않게 미리 return을 해준다.
    // 그런데 가드를 세워놨음에도 불구하고, Safari에서 실행되지 않는 문제점이 있었다. 이 문제는 해결중이다 ㅜㅜ!
    if (Notification.permission !== 'granted') return;

    // Notification API는 두 번째 인자로 option 값을 받는데, 뱃지 이미지와 아이콘 등을 설정해 줄 수 있다.
    // 초기 badge, icon을 설정해주었다.
    const newOption = {
      badge: './logo2.png',
      icon: './logo2.png',
      ...options,
    };

    // 만약 notificationRef가 아직 초기화되지 않았다면, 타이머가 아직 동작하고 있는거니까 notificationRef가 없을 때에만 새로운 알림을 만든다.
    if (!notificationRef.current) {
      // 여기 들어왔다는건 타이머가 실행되지 않고 있다는 것이니까, 타이머를 만들어준다.
      setNotificationTimer(timeout);
      
      // 푸시 알림에서 보여줄 title과 위에서 우리가 만든 custom option을 넣어준다.
      // 이 Notification 함수는 할당해도 바로 실행되기 때문에 첫 이벤트는 무조건 실행되고, 그 이후부터 타이머가 작동한다.
      notificationRef.current = new Notification(title, newOption);
      
      // Notification의 Click Event를 새로 붙여준다.
      setNotificationClickEvent();
    }
  };

  return { fireNotificationWithTimeout };
};