import React from 'react'
import {Document, Font, Image, Page, StyleSheet, Text, View} from '@react-pdf/renderer'
import {configuration} from '../../helpers/utilHelper'
import {IBuilding} from '../../@types/IBuilding'
import DocumentBuilding from './components/DocumentBuilding/DocumentBuilding'

Font.register({
    family: 'Roboto',
    src: '/fonts/roboto-medium-webfont.ttf'
})

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        fontFamily : 'Roboto'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        padding: 10,
        height: 70,
        flexShrink: 0,
        borderBottom: '1px solid #075ea5'
    },
    content: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        flexDirection: 'column'
    },
    footer: {
        height: 50,
        margin: 10,
        padding: 10,
        flexDirection: 'row',
        flexShrink: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#075ea5',
        color: '#fff',
    },
    containerLogo: {
        width: 100
    },
    containerContact: {
        width: 200,
        textAlign: 'right'
    },
    logoImage: {
        width: '100%',
        height: 'auto'
    },
    footerBlock: {
        width: '33%'
    },
    textSmall: {
        fontSize: 8
    },
    textDefault: {
        fontSize: 10
    },
    textMiddle: {
        fontSize: 12
    },
    textBig: {
        fontSize: 14
    },
    block: {
        padding: '10px 0',
        flexDirection: 'column'
    }
})

interface Props {
    type: 'building'
    building?: IBuilding
}

const defaultProps: Props = {
    type: 'building'
}

const PdfDocumentGenerator: React.FC<Props> = (props) => {
    const renderDocumentByType = () => {
        switch (props.type) {
            case 'building': {
                return <DocumentBuilding building={props.building || {} as IBuilding} styles={styles}/>
            }
        }
    }

    return (
        <Document>
            <Page size='A4' style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.containerLogo}>
                        <Image style={styles.logoImage} src='/img/logo-full.jpg'/>
                    </View>
                    <View style={styles.containerContact}>
                        <Text style={styles.textMiddle}>{configuration.sitePhone}</Text>
                        <Text style={styles.textDefault}>{configuration.siteEmail}</Text>
                    </View>
                </View>

                {renderDocumentByType()}

                <View style={styles.footer}>
                    <Text style={{...styles.textSmall, ...styles.footerBlock}}>
                        ИНН 123456789
                    </Text>
                    <Text style={{...styles.textSmall, ...styles.footerBlock, textAlign: 'center'}}>
                        ОГРН 123456789
                    </Text>
                    <Text style={{...styles.textSmall, ...styles.footerBlock, textAlign: 'right'}}>
                        2022. Все права защищены
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

PdfDocumentGenerator.defaultProps = defaultProps
PdfDocumentGenerator.displayName = 'PdfDocumentGenerator'

export default PdfDocumentGenerator