import * as React from 'react'
import { Container } from './index.style';
import { Text, TouchableOpacity } from 'react-native';
import { Row } from '../../../../components/shared/style';
import { useStyle } from '../../../../page/styles';
import { getLocale } from '$web-common/locale';
import { useDispatch } from "react-redux";
import { WalletActions } from "../../../../common/actions";
import { AutoTimerModal } from './modal';
import { useApiProxy } from '../../../../common/hooks/use-api-proxy';
import { RightArrow } from '../../setting/components';
import { ConfirmModal } from './confirmModal';

const Setting = () => {
  const style = useStyle()

  const dispatch = useDispatch()
  const resetWallet = () => {
    dispatch(WalletActions.resetWallet());
  }

  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const [isResetOpenModal, setIsResetOpenModal] = React.useState(false);
  const { keyringService } = useApiProxy()

  return (
    <Container>
      <TouchableOpacity onPress={() => setIsOpenModal(true)} style={style.flatten(['padding-16'])}>
        <Row justifyContent='space-between'>
          <Text style={style.flatten(['dark:color-white', 'subtitle2'])}>{getLocale('autoLockMinutes')}</Text>
          <RightArrow />
        </Row>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>setIsResetOpenModal(true)} style={style.flatten(['padding-y-15'])}>
        <Text style={style.flatten(['flex', 'color-red-300','flex' , 'items-center', 'justify-center'])}>{getLocale('walletReset')}</Text>
      </TouchableOpacity>
      {isOpenModal && <AutoTimerModal
        onConfirm={(lockTime) => {
          keyringService.setAutoLockMinutes(lockTime)
          setIsOpenModal(false);
        }}
        onCancel={() => {
          setIsOpenModal(false);
        }} />}
        {isResetOpenModal && <ConfirmModal
          onConfirm={() => {
            resetWallet()
            setIsResetOpenModal(false);
          }}
          onCancel={() => {
            setIsResetOpenModal(false);
          }} />}
    </Container>
  )
}

export default Setting;