import { useState,useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { api } from 'src/api/url';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';



// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {

  const[activeUser,setActiveUser] =useState([])
  const [blockUser, setBlockUsers] = useState([])
  const [monthlyUserData, setMonthlyUserData] =useState<number[]>([]);





  const fetchUsers = async () => {
    const response = await api.get('/admin/getAllUsers'); // Adjust API endpoint as needed
    return response.data;
  }
  
  const fetchActiveUsers = async () => {
    const response = await api.get('/admin/getActiveUsers'); // Adjust API endpoint as needed
    // return response.data;
    setActiveUser(response?.data?.data?.totalActiveUsers)
  }

  const fetchBlockUsers = async () => {
    const response = await api.get('/admin/getBlockUsers'); // Adjust API endpoint as needed
    // return response.data;
    setBlockUsers(response?.data?.data?.totalBlockUsers)

  }
  const fetchPost = async () => {
    const response = await api.get('/admin/getAllPost'); // Adjust API endpoint as needed
    return response.data;
  }

  const fetchMonthlyUserData = async () => {
    const response = await api.get('/admin/getUsersByMonth'); // Make sure your API endpoint matches
    return response.data; // Expected format: [{ month: 1, userCount: 30 }, { month: 2, userCount: 50 }, ...]
  };


  const { data: getAllUsers, error, isLoading } = useQuery({
    queryKey: ['admin/getAllUsers'],
    queryFn: fetchUsers,
    staleTime: 60000, // Cache for 60 seconds
  });
  const { data: activeUsers, error: activeUsersError, isLoading: activeUsersLoading } = useQuery({
    queryKey: ['admin/getActiveUsers'],
    queryFn: fetchActiveUsers,
    staleTime: 60000,
  });
  const { data: blockUsers , error: blockUsersError, isLoading: blockUsersLoading } = useQuery({
    queryKey: ['admin/getBlockUsers'],
    queryFn: fetchBlockUsers,
    staleTime: 60000,
  });
  const { data: getAllPost , error: getAllPostError, isLoading: getAllPostLoading } = useQuery({
    queryKey: ['admin/getAllPost'],
    queryFn: fetchPost,
    staleTime: 60000,
  });
  const { data: monthlyUsers, error: monthlyUsersError, isLoading: monthlyUsersLoading} = useQuery({
    queryKey: ['admin/getUsersByMonth'],
    queryFn: fetchMonthlyUserData,
    staleTime: 60000, // Cache for 60 seconds
  });

  useEffect(() => {
    if (monthlyUsers) {
      // Extract user count for each month from the fetched data
      const userCounts = Array(12).fill(0); // Initialize array with 12 months
      monthlyUsers.forEach((entry:any) => {
        userCounts[entry._id.month - 1] = entry.userCount; // Populate counts for each month
      });
      setMonthlyUserData(userCounts); // Set the monthly user data
    }
  }, [monthlyUsers]);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Example calculations (Modify as needed)
  const totalUsers = getAllUsers?.data?.length || 0
  const totalActiveUsers = activeUser.length || 0
  const totalBlockedUsers = blockUser.length || 0
  const totalPosts = getAllPost?.data?.length 
  console.log("totalPosts",totalPosts )


  // const activeUsers = users.filter((user) => user.active).length;
  // const blockedUsers = users.filter((user) => user.status === 'blocked').length;
  // const messages = Math.floor(totalUsers * 0.1); // Example logic


  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Users"
            percent={2.6}
            total={totalUsers}
            icon={<img alt="icon" src="/assets/icons/glass/user.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Active users"
            percent={-0.1}
            total={totalActiveUsers}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Blocked Users"
            percent={2.8}
            total={totalBlockedUsers}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Posts"
            percent={3.6}
            total={totalPosts}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'Total Users', value: totalUsers },
                { label: 'Blocked Users', value: totalBlockedUsers },
                { label: 'Active Users', value: totalActiveUsers },
                { label: 'Total Posts', value: totalPosts },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="User Gain"
            // subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Total User', data: monthlyUserData  },
                
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
