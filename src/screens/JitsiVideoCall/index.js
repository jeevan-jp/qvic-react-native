import React, { useEffect } from 'react';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';

function JitsiVideoCall(props) {

  useEffect(() => {
    setTimeout(() => {
      const url = props.route.params.url || "https://meet.jit.si/testing-jp1"; // can also be only room name and will connect to jitsi meet servers
      const displayName = props.route.params.name || "User";
      const userInfo = {
        displayName: displayName,
        email: 'test@test.com',
        avatar: 'https:/gravatar.com/avatar/abc123'
      };
      JitsiMeet.call(url, userInfo);
      /* Você também pode usar o JitsiMeet.audioCall (url) para chamadas apenas de áudio */
      /* Você pode terminar programaticamente a chamada com JitsiMeet.endCall () */
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      JitsiMeet.endCall();
    };
  });

  function onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    console.log('leaving...');
    props.navigation.goBack();
    // console.log(nativeEvent);
  }

  function onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    console.log(nativeEvent);
  }

  function onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log(nativeEvent);
  }

  return (
    <JitsiMeetView
      onConferenceTerminated={e => onConferenceTerminated(e)}
      onConferenceJoined={e => onConferenceJoined(e)}
      onConferenceWillJoin={e => onConferenceWillJoin(e)}
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }}
    />
  )
}
export default JitsiVideoCall;