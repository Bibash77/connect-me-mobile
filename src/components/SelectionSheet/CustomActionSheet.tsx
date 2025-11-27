import React, {useCallback, useMemo, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Text} from 'react-native-paper';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';

type ActionType = 'call' | 'website' | 'map' | 'email';

interface ActionData {
  call?: string;
  website?: string;
  map?: {latitude: number; longitude: number};
  email?: string;
}

interface CustomActionSheetProps {
  type: ActionType;
  data: ActionData;
  isVisible: boolean;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  onClose: () => void;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const CustomActionSheet: React.FC<CustomActionSheetProps> = ({
  type,
  data,
  isVisible,
  bottomSheetModalRef,
  onClose,
}) => {
  const snapPoints = useMemo(() => ['35%'], []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, bottomSheetModalRef]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const handleAction = useCallback(() => {
    switch (type) {
      case 'call':
        if (data.call) {
          Linking.openURL(`tel:${data.call}`);
        }
        break;
      case 'website':
        if (data.website) {
          Linking.openURL(data.website);
        }
        break;
      case 'map':
        if (data.map) {
          const {latitude, longitude} = data.map;
          const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          Linking.openURL(url);
        }
        break;
      case 'email':
        if (data.email) {
          Linking.openURL(`mailto:${data.email}`);
        }
        break;
    }
    onClose();
  }, [type, data, onClose]);

  const handleCopy = useCallback(() => {
    let copiedText = '';
    switch (type) {
      case 'call':
        copiedText = data.call || '';
        break;
      case 'website':
        copiedText = data.website || '';
        break;
      case 'email':
        copiedText = data.email || '';
        break;
    }
    Clipboard.setString(copiedText);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
    onClose();
  }, [type, data, onClose]);

  const getValue = () => {
    switch (type) {
      case 'call':
        return data.call;
      case 'website':
        return data.website;
      case 'email':
        return data.email;
      default:
      case 'map':
        return 'Google Maps';
        return '';
    }
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={styles.indicator}>
      <BottomSheetView style={styles.container}>
        <Text style={styles.value}>{getValue()}</Text>

        {(type === 'call' || type === 'website' || type === 'email') && (
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <View style={[styles.iconContainer, {backgroundColor: '#50C878'}]}>
              <Icon name="content-copy" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>
              Copy{' '}
              {type === 'call'
                ? 'Number'
                : type === 'website'
                ? 'Link'
                : 'Email'}
            </Text>
          </TouchableOpacity>
        )}

        {type === 'call' && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAction}>
              <View
                style={[styles.iconContainer, {backgroundColor: '#00B2FF'}]}>
                <Icon name="phone" size={24} color="white" />
              </View>
              <Text style={styles.actionText}>Cellular call</Text>
            </TouchableOpacity>
          </>
        )}

        {type === 'website' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
            <View style={[styles.iconContainer, {backgroundColor: '#2196F3'}]}>
              <Icon name="web" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Open Website</Text>
          </TouchableOpacity>
        )}

        {type === 'email' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
            <View style={[styles.iconContainer, {backgroundColor: '#E91E63'}]}>
              <Icon name="email" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Send Email</Text>
          </TouchableOpacity>
        )}

        {type === 'map' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
            <View style={[styles.iconContainer, {backgroundColor: '#FF9800'}]}>
              <Icon name="map-marker" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Open Map</Text>
          </TouchableOpacity>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: '#DEDEDE',
    width: 40,
  },
  container: {
    padding: 16,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    color: '#000',
  },
});

export default CustomActionSheet;
