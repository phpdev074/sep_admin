/* eslint-disable */
import { useState, useMemo, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { DashboardContent } from 'src/layouts/dashboard';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from 'src/api/url';
import { CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

interface PageData {
  title: string;
  description: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function ContactUsViewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [pages, setPages] = useState<PageData[]>([
    {
      title: 'Terms & Conditions',
      description: '',
    },
    {
      title: 'Privacy Policy',
      description: '',
    },
    {
      title: 'About Us',
      description: '',
    },
  ]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/pages`);
      // console.log(data.data, '===>data');
      setPages(data.data);
      return data?.data || [];
    } catch (err: any) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'align',
    'link',
    'image',
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setIsEditing(false);
  };

  const handleSave = async (item: any) => {
    setIsSaving(true)
    try {
      await api.put('/api/pages/updatePageInfo', {
        type: item.type,
        description: pages[activeTab].description,
        title: pages[activeTab].title,
      });
      setIsEditing(false);
    } catch (error) {
      // handle error if needed
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original content if needed
  };

  const handleTitleChange = (newTitle: string) => {
    setPages((prev) =>
      prev.map((page, index) => (index === activeTab ? { ...page, title: newTitle } : page))
    );
  };

  const handleContentChange = (newContent: string) => {
    setPages((prev) =>
      prev.map((page, index) => (index === activeTab ? { ...page, description: newContent } : page))
    );
  };

  const currentPage = pages[activeTab];

  if (isLoading) return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        > 
          <CircularProgress /> 
        </Box>
      );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          {isEditing ? `Edit ${currentPage.title}` : 'Pages'}
        </Typography>

        {!isEditing && (
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Edit Page
          </Button>
        )}
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="static pages tabs"
            variant="fullWidth"
          >
            <Tab label="Terms & Conditions" />
            <Tab label="Privacy Policy" />
            <Tab label="About Us" />
          </Tabs>
        </Box>

        {pages.map((page, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            {isEditing && activeTab === index ? (
              <EditPageContent
                page={currentPage}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                onSave={handleSave}
                onCancel={handleCancel}
                modules={modules}
                formats={formats} 
                isSaving={isSaving}      
                />
            ) : (
              <ViewPageContent page={currentPage} />
            )}
          </TabPanel>
        ))}
      </Card>
    </DashboardContent>
  );
}

// Edit Page Component
interface EditPageContentProps {
  page: PageData;
  onTitleChange: (title: string) => void;
  onContentChange: (description: string) => void;
  onSave: (item: any) => void;
  onCancel: () => void;
  modules: any;
  formats: string[];
  isSaving: boolean;
}

function EditPageContent({
  page,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
  modules,
  formats,
  isSaving,
}: EditPageContentProps) {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Page Title"
            value={page.title}
            onChange={(e) => onTitleChange(e.target.value)}
            sx={{ mb: 3 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Page Content
          </Typography>
          <ReactQuill
            theme="snow"
            value={page.description}
            onChange={onContentChange}
            modules={modules}
            formats={formats}
            style={{ height: '400px', marginBottom: '50px' }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={() => onSave(page)} disabled={isSaving} startIcon={isSaving ? <CircularProgress size={20} /> : null}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </>
  );
}

// View Page Component
interface ViewPageContentProps {
  page: PageData;
}

function ViewPageContent({ page }: ViewPageContentProps) {
  return (
    <Box>
      {/* <Typography variant="h4" gutterBottom>
        {page.title}
      </Typography> */}
      <Box
        sx={{
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: 2,
            marginBottom: 1,
          },
          '& p': {
            marginBottom: 1,
          },
          '& ul, & ol': {
            paddingLeft: 2,
          },
        }}
        dangerouslySetInnerHTML={{ __html: page.description }}
      />
    </Box>
  );
}
