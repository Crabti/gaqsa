import {
  Button, Modal, Typography, Collapse,
} from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const PrivacyNotice: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { Panel } = Collapse;
  const { Text } = Typography;

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const gaqsaAddress = (
    <>
      {' '}
      <Text
        strong
      >
        Av. Tepeyac 1280, Colonia Parque Industrial O’Donnell
        Aeropuerto, El Marqués, Querétaro C.P. 76250
      </Text>
      {' '}
    </>
  );

  const gaqsaCapital = (
    <>
      {' '}
      <Text
        strong
      >
        Ganaderos Asociados de Querétaro, S.A. de C.V
      </Text>
      {' '}
    </>
  );

  const introduction = (
    <Typography>
      {gaqsaCapital}
      (en lo sucesivo GAQSA)
      con domicilio en
      {gaqsaAddress}
      y teléfono (442) 253 0038,
      es responsable del tratamiento de sus datos personales.
    </Typography>
  );

  const purpose = (
    <>
      <Typography>
        Sus datos personales serán utilizados para lo siguiente:
        <br />
        - Proveer los servicios y productos requeridos por usted.
        <br />
        - Informar sobre cambios o nuevos productos o servicios que estén
        relacionados con el adquirido por el cliente.
        <br />
        - Dar cumplimiento a obligaciones contraídas con nuestros clientes.
        <br />
        - Evaluar la calidad del servicio.
      </Typography>
    </>
  );

  const dataCollection = (
    <Typography>
      Para las finalidades señaladas
      en el presente aviso de privacidad, podemos recabar
      sus datos personales de distintas formas: cuando usted
      nos los proporciona directamente y cuando obtenemos
      información a través de otras fuentes que están permitidas
      por la ley. Datos personales que recabamos de forma
      directa cuando usted mismo nos los proporciona por
      diversos medios, como cuando participa en nuestras
      promociones o nos da información con objeto de que
      le prestemos un servicio. Los datos que obtenemos
      por este medio pueden ser, entre otros: nombre, dirección,
      teléfono, edad, sexo, Registro Federal de Contribuyentes
      y correo electrónico.
      <br />
      Nos comprometemos a que los mismos serán tratados
      bajo las más estrictas medidas de seguridad que garanticen
      su confidencialidad.
    </Typography>
  );

  const numberPhone = (
    <>
      {' '}
      <Text
        type="danger"
      >
        (442) 253 0038
      </Text>
      {' '}
    </>
  );

  const mail = (
    <>
      {' '}
      <Text
        type="danger"
      >
        avisodeprivacidad@gaqsa.com
      </Text>
      {' '}
    </>
  );

  const gaqsa = (
    <>
      {' '}
      <Text
        type="danger"
      >
        GAQSA
      </Text>
      {' '}
    </>
  );

  const limitations = (
    <Typography>
      Usted puede dejar de recibir mensajes
      promocionales por teléfono fijo o celular siguiendo
      los siguientes pasos: llamar al teléfono
      {numberPhone}
      o bien enviar la solicitud al correo electrónico
      {mail}
    </Typography>
  );

  const accessRights = (
    <Typography>
      Usted tiene derecho de acceder a sus datos personales
      que poseemos y a los detalles del tratamiento
      de los mismos, así como a rectificarlos en caso
      de ser inexactos o incompletos; cancelarlos cuando
      considere que no se requieren para alguna de las
      finalidades señalados en el presente aviso de privacidad,
      estén siendo utilizados para finalidades no consentidas
      o haya finalizado la relación de servicio, o bien,
      oponerse al tratamiento de los mismos para fines específicos.
      <br />
      Los mecanismos que se han implementado para
      el ejercicio de dichos derechos son a través de la
      presentación de la solicitud respectiva en:
      <br />
      <br />
      • Vía telefónica al
      {numberPhone}
      , o por correo
      electrónico a la siguiente dirección
      {mail}
      <br />
      <br />
      Su solicitud deberá contener la siguiente información:
      <br />
      - 1. El nombre y domicilio del titular o cualquier otro
      medio para recibir la respuesta (si el titular omite la
      dirección o cualquier otro medio que haya elegido para
      contactarlo, se tendrá por no recibida la solicitud).
      <br />
      - 2. Los documentos que acrediten la identidad o la
      personalidad de su representante.
      <br />
      - 3. La descripción clara y precisa de los datos personales
      respecto de los cuales el titular busca ejercer alguno
      de los derechos.
      <br />
      - 4. En su caso, otros elementos o documentos que
      faciliten la localización de los datos personales.
      <br />
      <br />
      La solicitud podrá ser presentada por escrito en el
      lugar antes indicado o bien hacerse por correo electrónico
      a la dirección citada.
      <br />
      Si la solicitud del titular no es clara, errónea o incompleta,
      {gaqsa}
      podrá pedirle que aporte información adicional
      para atender su petición dentro de los 5 días hábiles
      siguientes a la recepción de la solicitud, de no dar
      respuesta la solicitud se tendrá por no presentada.
      <br />
      El plazo para atender su solicitud no podrá exceder
      de veinte días hábiles a partir del ingreso. En caso
      de que se haya requerido información adicional,
      dicho plazo empezará a computarse al día siguiente
      en que el titular haya proporcionado la información
      requerida. Le informaremos sobre la procedencia
      de la misma a través del medio que haya señalado
      para tal efecto.
      <br />
      Para mayor información, favor de comunicarse al
      departamento de administración o al correo electrónico
      {mail}
      <br />
      En todo momento, usted podrá revocar el consentimiento
      que nos ha otorgado para el tratamiento de sus datos
      personales, a fin de que dejemos de hacer uso de los
      mismos a través de los medios antes descritos.
    </Typography>
  );

  const dataTransfer = (
    <Typography>
      Sus datos personales
      pueden ser transferidos y tratados dentro y fuera del país,
      a cualquiera de sus subsidiarias y/o afiliadas, quienes
      quedarán obligadas a resguardar y utilizar la información
      en términos de este Aviso de Privacidad.
      <br />
      Asimismo, le informamos que sus datos personales
      pueden ser transferidos y tratados dentro y fuera del país,
      por personas distintas a esta empresa. En ese sentido,
      su información puede ser compartida con las empresas
      controladoras, subsidiarias o afiliadas de
      {gaqsa}
      terceros proveedores de servicios para el cumplimiento
      de las obligaciones legales, contables, regulatorias o
      contractuales a cargo de
      {gaqsa}
      o de cualquiera de
      sus empresas controladoras, subsidiarias o afiliadas,
      y; terceros con fines de mercadotecnia, tecnologías de
      la información, operación, administración, comercialización
      y otros fines análogos y lícitos. Si usted no manifiesta su
      oposición para que sus datos personales sean transferidos,
      se entenderá que ha otorgado su consentimiento para ello.
      <br />
      Nos comprometemos a no transferir su información personal
      a terceros sin su consentimiento, salvo las excepciones
      previstas en el artículo 37 de la Ley Federal de Protección
      de Datos Personales en Posesión de los Particulares, así
      como a realizar esta transferencia en los términos que fija esa ley.
      <br />
      Si usted no manifiesta su oposición para que sus
      datos personales sean transferidos, se entenderá que
      ha otorgado su consentimiento para ello.
    </Typography>
  );

  const futureModifications = (
    <Typography>
      Ganaderos Asociados de Querétaro, S.A. de C.V. podrá efectuar
      en cualquier momento modificaciones o actualizaciones
      al presente aviso de privacidad, para la atención de
      novedades legislativas s o jurisprudenciales, políticas
      internas o nuevos requerimientos para la prestación u
      ofrecimiento de nuestros servicios o productos.
      <br />
      Si usted considera que su derecho de protección de datos
      personales ha sido lesionado por alguna conducta de nuestros
      empleados o de nuestras actuaciones o respuestas, presume
      que en el tratamiento de sus datos personales existe alguna
      violación a las disposiciones previstas en la Ley Federal de
      Protección de Datos Personales en Posesión de los Particulares,
      podrá interponer la queja o denuncia correspondiente ante el IFAI.
    </Typography>
  );

  return (
    <>
      <Button
        type="link"
        onClick={showModal}
      >
        Aviso de Privacidad
      </Button>
      <Modal
        title="Aviso de Privacidad"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <p>{introduction}</p>
        <Collapse
          bordered={false}
          expandIcon={
            ({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />
          }
          className="site-collapse-custom-collapse"
        >
          <Panel
            header="Finalidad"
            key="1"
            className="site-collapse-custom-panel"
          >
            <p>{purpose}</p>
          </Panel>
          <Panel
            header="Obtención de datos"
            key="2"
            className="site-collapse-custom-panel"
          >
            <p>{dataCollection}</p>
          </Panel>
          <Panel
            header="Limitación al uso o divulgación de sus datos personales"
            key="3"
            className="site-collapse-custom-panel"
          >
            <p>{limitations}</p>
          </Panel>
          <Panel
            header="Procedimiento para ejercer los derechos de acceso,
            rectificación, cancelación u oposición"
            key="4"
            className="site-collapse-custom-panel"
          >
            <p>{accessRights}</p>
          </Panel>
          <Panel
            header="Transferencias de datos"
            key="5"
            className="site-collapse-custom-panel"
          >
            <p>{dataTransfer}</p>
          </Panel>
          <Panel
            header="Modificaciones al aviso de privacidad"
            key="6"
            className="site-collapse-custom-panel"
          >
            <p>{futureModifications}</p>
          </Panel>
        </Collapse>
      </Modal>
    </>
  );
};

export default PrivacyNotice;
