import {
  CameraOutlined,
  EditOutlined,
  ShareAltOutlined,
  CheckOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Modal, Upload } from "antd";
import moment from "moment";
import { useState } from "react";
import { useAppStore } from "../../../store";
import "./Profile.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserById,
  updateAvatar,
  updateCoverPage,
  updateProfile,
} from "../../../api/auth";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

interface ProfileScreenProps {
  isDarkMode: boolean;
}

// Helper function to add ordinal suffix (1st, 2nd, 3rd, etc.)
const addOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

const ProfileScreen = ({ isDarkMode }: ProfileScreenProps) => {
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { userInfo, addUserInfo, removeUserInfo } = useAppStore();
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);

  const userId = searchParams.get("userId") || userInfo?.userId || userInfo?.id;

  const { data: userDetail } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      removeUserInfo();
      addUserInfo(updatedUser);

      // Update form fields with new values
      form.setFieldsValue({
        userName: updatedUser.userName,
        bio: updatedUser.bio,
        dateOfBirth: updatedUser.dateOfBirth
          ? moment(updatedUser.dateOfBirth)
          : null,
      });
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error(error);
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return await updateAvatar(formData);
    },
    onSuccess: (updatedUser) => {
      toast.success("Avatar updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      addUserInfo(updatedUser);
    },
    onError: (error) => {
      toast.error("Failed to update avatar");
      console.error(error);
    },
  });

  const updateCoverMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return await updateCoverPage(formData);
    },
    onSuccess: () => {
      toast.success("Cover photo updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error("Failed to update cover photo");
      console.error(error);
    },
  });

  const handleProfileUpdate = async (values: {
    userName: string;
    bio: string;
    dateOfBirth: moment.Moment;
  }) => {
    try {
      await updateProfileMutation.mutate({
        userName: values.userName,
        bio: values.bio,
        dateOfBirth: values.dateOfBirth.toISOString(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    await updateAvatarMutation.mutateAsync(file);
  };

  const handleCoverUpload = async (file: File) => {
    await updateCoverMutation.mutateAsync(file);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile?userId=${userId}`;
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    message.success("Profile URL copied to clipboard!");

    // Reset the icon after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const formatBirthDate = (date: string) => {
    const momentDate = moment(date);
    const day = momentDate.date();
    const formattedDay = addOrdinalSuffix(day);
    return momentDate.format(`[${formattedDay}] MMM YYYY`);
  };

  return (
    <div className={`profile-container ${isDarkMode ? "dark" : "light"}`}>
      {/* Cover Photo Section */}
      <div
        className="cover-photo"
        style={{ height: "200px", position: "relative" }}
      >
        <img
          src={
            userDetail?.coverPageUrl ||
            "https://res.cloudinary.com/dcivdqyyj/image/upload/v1736917792/yeapabfhfrqzsajslz4u.jpg"
          }
          alt="Cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Upload
          customRequest={({ file, onSuccess }: any) => {
            handleCoverUpload(file).then(() => onSuccess?.("ok"));
          }}
          showUploadList={false}
          disabled={updateCoverMutation.isPending}
        >
          <Button
            icon={<CameraOutlined />}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              backgroundColor: "#f0f2f5",
              border: "none",
              color: "#65676b",
            }}
            loading={updateCoverMutation.isPending}
          >
            Change Cover
          </Button>
        </Upload>
      </div>

      {/* Profile Info Section */}
      <div className={`profile-info ${isDarkMode ? "dark" : "light"}`}>
        {/* Avatar */}
        <div
          style={{
            marginTop: "-50px",
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={
              userDetail?.avatarUrl ||
              "https://res.cloudinary.com/dcivdqyyj/image/upload/v1736917936/xhqqyeojvg8eghkwhhlv.jpg"
            }
            alt="Avatar"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: `3px solid ${isDarkMode ? "#1f1f1f" : "white"}`,
            }}
          />
          <Upload
            customRequest={({ file, onSuccess }: any) => {
              handleAvatarUpload(file).then(() => onSuccess?.("ok"));
            }}
            showUploadList={false}
            disabled={updateAvatarMutation.isPending}
          >
            <Button
              icon={<CameraOutlined />}
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                backgroundColor: "#f0f2f5",
                border: "none",
                color: "#65676b",
              }}
              shape="circle"
              loading={updateAvatarMutation.isPending}
            />
          </Upload>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="profile-header">
            <h2>{userDetail?.userName}</h2>
            <div className="profile-actions">
              {userInfo?.id === userDetail?.id ? (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  style={{
                    backgroundColor: "#f0f2f5",
                    border: "none",
                    color: "#65676b",
                    marginRight: "8px",
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  icon={<HeartOutlined />}
                  // onClick={() => setIsEditing(true)}
                  style={{
                    backgroundColor: "#f0f2f5",
                    border: "none",
                    color: "#65676b",
                    marginRight: "8px",
                  }}
                >
                  Follow
                </Button>
              )}
              <Button
                icon={isCopied ? <CheckOutlined /> : <ShareAltOutlined />}
                onClick={handleShare}
                style={{
                  backgroundColor: "#f0f2f5",
                  border: "none",
                  color: isCopied ? "#1890ff" : "#65676b",
                }}
              >
                {isCopied ? "Copied!" : "Copy Profile URL"}
              </Button>
            </div>
          </div>

          <p className="birth-date">
            Birth Date:{" "}
            {userDetail?.dateOfBirth
              ? formatBirthDate(userDetail.dateOfBirth)
              : "N/A"}
          </p>
          <p className="bio">{userDetail?.bio}</p>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">
                {userDetail?.posts?.length || 0}
              </span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {userDetail?.followers?.length || 0}
              </span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {userDetail?.following?.length || 0}
              </span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isEditing}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
        className={isDarkMode ? "dark-modal" : ""}
      >
        <Form
          form={form}
          onFinish={handleProfileUpdate}
          initialValues={{
            userName: userDetail?.userName,
            bio: userDetail?.bio,
            dateOfBirth: userDetail?.dateOfBirth
              ? moment(userDetail.dateOfBirth)
              : null,
          }}
          className={`profile-form ${isDarkMode ? "dark" : "light"}`}
          layout="vertical"
        >
          <Form.Item
            label="Username :"
            name="userName"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item label="Date of Birth :" name="dateOfBirth">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select your birth date"
              className={isDarkMode ? "dark-date-picker" : ""}
            />
          </Form.Item>
          <Form.Item label="Bio :" name="bio">
            <Input.TextArea
              placeholder="Write something about yourself"
              rows={4}
            />
          </Form.Item>
          <Form.Item className="modal-footer">
            <Button
              onClick={handleCancel}
              style={{ marginRight: 8 }}
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateProfileMutation.isPending}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileScreen;
