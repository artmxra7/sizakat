import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

import Navbar from '../../components/NavigationBar/NavBarWithRouter';
import TitleBar from '../../components/Titles/TitleBar';
import TableDataSource from '../../components/Tables/TableDataSource';
import { toCapitalCase } from '../../utils/string-util';
import { resolveDataSourceName } from '../../utils/parser-util';

const INITIAL_DATA_SOURCES_QUERY = gql`
  query {
    dataSources {
      id
      category
      dataSourceDetail {
        ... on DataSourceWargaType {
          picName
          rt
          rw
          village
        }
        ... on DataSourceInstitusiType {
          picName
          name
          village
        }
        ... on DataSourcePekerjaType {
          picName
          profession
          location
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

const dataSourcesToCardItem = (dataSource) => {
  return {
    id: dataSource.id,
    desc: resolveDataSourceName(dataSource),
    label: dataSource.dataSourceDetail.picName
  };
}



const MainContent = () => {

  const [NotYetFetched, setNotYetFetched] = useState(true);
  const [dataSources, setDataSources] = useState()
  const {loading, error} = useQuery(
    INITIAL_DATA_SOURCES_QUERY,
    {onCompleted: (data) => setDataSources(data.dataSources)}
  );

  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>error</p>
  }
  return (
    <Container>
      <Nav>
        <Navbar
          user={{
            name: 'Annisaa Fitri Shabrina',
            role: 'ADMIN'
          }}
        />
      </Nav>
      <Main>
        <Title>
          <TitleBar
            title={'Daftar Sumber Data Mustahik'}
            path={'Mustahik //'}
            current={'Sumber Data Mustahik'}
          />
        </Title>
        <TableContainer>
          {dataSources && (
            <TableDataSource
              title={'Sumber Data Mustahik'}
              buttonCaption={'Tambah Sumber Data'}
              itemList={dataSources.map(dataSourcesToCardItem)}
              detailPath={'/detail/sumber-data-mustahik'}
              setDataSourceData={(data) => setDataSources(data)}
            />
          )}
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
