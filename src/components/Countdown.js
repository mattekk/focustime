import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { spacing, fontSizes } from '../utils/sizes';
import { colors } from '../utils/colors';

const minutesToMilis = min => min * 60 * 1000;
const formatTime = (time) => time < 10 ? `0${time}` : time;

export const Countdown = ({
  minutes = 20,
  isPaused = true,
  onProgress,
  onEnd,
}) => {

  const interval = React.useRef(null);
  
  const doCountDown = () => {
    setMilis(time => {
      if (time === 0) {
        clearInterval(interval.current);
        
        return time;
      }

      const timeLeft = time - 1000;
      
      // report the progress
      // wrong: causing sideeffect in external component (Timer)
      // onProgress(timeLeft / minutesToMilis(minutes));

      return timeLeft;
    })
  }
  const [milis, setMilis] = useState(null);

  useEffect(() => {
    if (isPaused) {

      if (interval.current) clearInterval(interval);
      
      return;
    }
    
    interval.current = setInterval(doCountDown, 1000);

    return () => clearInterval(interval.current)
  }, [isPaused]);

  // anytime new minutes come in (set from a Timing component for example) reset minutes
  useEffect(() => {
    setMilis(minutesToMilis(minutes))
  }, [minutes]);

  useEffect(() => {
    onProgress(millis / minutesToMilis(minutes));

    if (millis === 0) {
      onEnd();  
    }
  }, [millis]);

  let minute = Math.floor(milis / 1000 / 60) % 60;
  let seconds = ((milis / 1000) % 60);

  return (
    <Text style={styles.text}>{`${formatTime(minute)}:${formatTime(seconds)}`}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: "bold",
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  }
})