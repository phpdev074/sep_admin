import { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, TextField, DialogTitle } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

// Define the dialog content (admin editing view for FAQ, Terms, and Privacy)
const editableSections = {
  faq: "FAQ",
  terms: "Terms and Conditions",
  privacy: "Privacy Policy"
};
const initialContent = {
  faq: "Here are some frequently asked questions...",
  terms: "These are the terms and conditions of our service...",
  privacy: "This is the privacy policy of our website..."
};
type Section = keyof typeof initialContent;

export function SettingView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | undefined>(undefined);
  const [sectionContent, setSectionContent] = useState<string>("");

  const handleClickOpenDialog = (section: Section) => {
    setCurrentSection(section);
    setSectionContent(initialContent[section]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveContent = () => {
    // Handle saving the content here (e.g., API call to save data)
    console.log(`Saving ${currentSection}:`, sectionContent);
    setOpenDialog(false);
  };

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
        <Typography variant="h4" mb={3}>
          Settings
        </Typography>

        {/* Box for each section with a click handler */}
        {Object.entries(editableSections).map(([key, value]) => (
          <Box
            key={key}
            mb={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: 250,
              height: 60,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => handleClickOpenDialog(key as Section)}
          >
            <Typography variant="h6">{value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Dialog for editing content */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth sx={{ minHeight: '450px' }}>
        <DialogTitle>Edit {currentSection && editableSections[currentSection]}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={`${editableSections[currentSection ?? 'faq'] || 'Unknown'} Content`}
            multiline
            rows={8}  // Increased height of TextField
            value={sectionContent}
            onChange={(e) => setSectionContent(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 'auto', // Ensures height adjusts based on content
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveContent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
