import {StyleSheet} from 'react-native';
import {SD} from '../../utils';

export const styles = StyleSheet.create<any>({
  container: (AppTheme: any) => ({
    // borderWidth: 1,
    backgroundColor: AppTheme.Base,
    borderRadius: SD.hp(12),
    
  }),
});
