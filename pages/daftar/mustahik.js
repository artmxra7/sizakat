
import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

import Navbar from '../../components/NavigationBar/NavigationBar';
import TitleBar from '../../components/Titles/TitleBar';
import TableMustahik from '../../components/Tables/TableMustahik';
import { resolveDataSourceName } from '../../Utils/ParserUtil';

const INITIAL_MUSTAHIK_QUERY = gql`
  query {
    mustahiks {
      name
      dataSource {
        category
        dataSourceDetail {
          ... on DataSourceWargaType {
            rt
            rw
            village
          }
          ... on DataSourceInstitusiType {
            name
            village
          }
          ... on DataSourcePekerjaType {
            profession
            location
          }
        }
      }
    }
  }
`

const Container = styled.div`
  display: flex;
`

const Nav = styled.nav`
  margin-right: 30px;
  position: fixed;
`

const Main = styled.div`
  flex-grow: 4;
  margin: 0px 60px 0px 270px;
  height: 100%;
`

const Title = styled.div`
  margin: 20px 0px;
`

const TableContainer = styled.div`
`

const mustahikToCardItem = (mustahik) => {
  return {
    id: mustahik.id,
    label: mustahik.name,
    desc: resolveDataSourceName(mustahik.dataSource),
  }
}

const MainContent = () => {
  const { loading, error, data } = useQuery(INITIAL_MUSTAHIK_QUERY);
  const [ NotYetFetched, setNotYetFetched] = useState(true);
  const [dataMustahik, setDataMustahik] = useState()
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>error</p>
  }
  if(data && data.mustahiks && NotYetFetched){
    setDataMustahik(data);
    setNotYetFetched(false);
  }
  return (
    <Container>
      <Nav>
        <Navbar
          name={'Annisaa Fitri Shabrina'}
          role={'Admin'}
          menu={'Mustahik'}
          submenu={[
            'Data Mustahik',
            'Sumber Data Mustahik'
          ]}
          onMenuClicked={(item) => console.log(item)}
        />
      </Nav>
      <Main>
        <Title>
          <TitleBar
            title={'Daftar Mustahik'}
            path={'Mustahik //'}
            current={'Daftar Mustahik'}
          />
        </Title>
        <TableContainer>
          {dataMustahik && dataMustahik.mustahiks && <TableMustahik
            title={'Data Mustahik'}
            buttonCaption={'Tambah Mustahik'}
            searchPlaceholder={'Cari berdasarkan nama, nomor KTP'}
            filterCaption={'SEMUA SUMBER DATA'}
            filterOptions={['Semua Sumber Data',]}
            itemList={dataMustahik.mustahiks.map(mustahikToCardItem)}
            onCardDetailClicked={(id) => console.log(id)}
            setMustahikData={(data)=> setDataMustahik(data)}
          />}
        </TableContainer>
      </Main>
    </Container>
  );
}

export default function SumberDataMustahik({ backend_uri }) {
  const client = new ApolloClient({
    uri: backend_uri,
    cache: new InMemoryCache()
  });
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Daftar Sumber Data Mustahik</title>
      </Head>
      <main>
        <MainContent />
      </main>
    </ApolloProvider>
  )
}

export async function getStaticProps() {
  return {
    props: {
      backend_uri: `http://${process.env.GRAPHQL_URL}`
    }
  }
}
