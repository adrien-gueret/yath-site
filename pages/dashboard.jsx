import { Grid, Typography, makeStyles, Icon, Paper, Button } from '@material-ui/core';

import { Head } from 'modules/app';
import { makeTranslations } from 'modules/i18n';
import { MainLayout, LayoutContainer } from 'modules/layouts';

const useStyles = makeStyles(({ }) => ({

}), { classNamePrefix: 'Dashboard' });

const useTranslations = makeTranslations('dashboard', {
  fr: {
   
  },
  en: {
   
  },
});

const Dashboard = () => {
  const t = useTranslations();
  const classes = useStyles();
  
  return (
    <>
      <Head description={t('metaDescription')} />
      
      <MainLayout>

        <LayoutContainer>
          
        </LayoutContainer>

        <LayoutContainer>
         
        </LayoutContainer>
        
      </MainLayout>
    </>
  );
}

export default Dashboard;
