import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import styles from "./AttendMentoring.module.css";
import { useOutletContext } from "react-router-dom";

const AttendMentoring = () => {
  const [formData, setFormData] = useState({
    StudentMentoringID: "",
    DateOfMentoring: "",
    ScheduledMeetingDate: "",
    NextMentoringDate: "",
    IssuesDiscussed: "",
    MentoringMeetingAgenda: "",
    AttendanceStatus: "Present",
    AbsentRemarks: "",
    IsParentPresent: false,
    ParentName: "",
    ParentMobileNo: "",
    StudentsOpinion: "",
    ParentsOpinion: "",
    StaffOpinion: "",
    StressLevel: "Normal",
    LearnerType: "Visual",
    Description: "",
  });

  const [upcoming, setUpcoming] = useState([]);
  const [pending, setPending] = useState([]);
  const [mentoringId, setMentoringId] = useState("");
  const userData = useOutletContext();

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/staff/${userData?.user?.StaffID}/upcoming-mentoring`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch Upcoming Sessions");
        }
        return res.json();
      })
      .then((data) => {
        setUpcoming(data);
      });
  }, [userData]);

  useEffect(() => {
    const staffId = userData?.user?.StaffID;

    if (!staffId) return;

    fetch(`http://localhost:3000/api/studentmentoring/admin/mentoring/pending/${staffId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Pending Sessions. Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Pending API Data:", data);
        setPending(data || []);
      })
      .catch(err => console.error("Pending fetch error:", err));

  }, [userData?.user?.StaffID]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3000/api/studentmentoring/session/${mentoringId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Session Attended SuccesFully");
        setFormData({
          DateOfMentoring: "",
          ScheduledMeetingDate: "",
          NextMentoringDate: "",
          IssuesDiscussed: "",
          MentoringMeetingAgenda: "",
          AttendanceStatus: "",
          AbsentRemarks: "",
          IsParentPresent: false,
          ParentName: "",
          ParentMobileNo: "",
          StudentsOpinion: "",
          ParentsOpinion: "",
          StaffOpinion: "",
          StressLevel: "Normal",
          LearnerType: "Visual",
          Description: "",
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="animate-slide-up stagger-1">Attend Mentoring</h1>
        <p className="animate-fade-in stagger-2 text-subtle">
          Log details and update records for a student mentoring session.
        </p>
      </div>

      <div className="animate-fade-in stagger-3">
        <Card title="Meeting Log Form" style={{ width: "" }}>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* Top Row Dates */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Scheduled Meeting Date</label>
              {/* <select
                name="scheduledMeetingDate"
                value={formData.scheduledMeetingDate}
                onChange={(e) => {
                  const selectedOption = upcoming.find(
                    o => `${o.ScheduledMeetingDate} - ${o.StudentName} - ${o.EnrollmentNo}` === e.target.value
                  );
                  if (selectedOption) setMentoringId(selectedOption.StudentMentoringID);
                  setFormData({ ...formData, scheduledMeetingDate: e.target.value });
                }}
                className={styles.select}
                required
              >
                <option value="" selected disabled>-- Select Upcoming Meeting --</option>
                {upcoming.map((o) => (
                  <option required key={o.StudentMentoringID} onClick={() => { setMentoringId(o.StudentMentoringID) }} value={`${o.ScheduledMeetingDate} - ${o.StudentName} - ${o.EnrollmentNo}`}>{o.ScheduledMeetingDate} - {o.StudentName} - {o.EnrollmentNo}</option>
                ))}

              </select> */}

              <select
                name="scheduledMeetingDate"
                value={mentoringId}
                onChange={(e) => {
                  const selected = [...upcoming, ...pending].find(
                    (o) => o.StudentMentoringID == e.target.value
                  );

                  if (selected) {
                    setMentoringId(selected.StudentMentoringID);

                    setFormData((prev) => ({
                      ...prev,
                      StudentMentoringID: selected.StudentMentoringID,
                      ScheduledMeetingDate: selected.ScheduledMeetingDate,
                      MentoringMeetingAgenda: selected.MentoringMeetingAgenda
                    }));
                  }
                }}
                className={styles.select}
                required
              >
                <option value="" disabled>
                  -- Select Upcoming And Pending Meeting --
                </option>
                {upcoming.map((o) => (
                  <option
                    required
                    key={o.StudentMentoringID}
                    value={o.StudentMentoringID}
                  >
                    {o.ScheduledMeetingDate} - {o.StudentName} -{" "}
                    {o.EnrollmentNo}
                  </option>
                ))}

                {pending.map((o) => (
                  <option
                    required
                    key={o.StudentMentoringID}
                    value={o.StudentMentoringID}
                  >
                    {o.ScheduledMeetingDate} - {o.StudentName} -{" "}
                    {o.EnrollmentNo}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date of Mentoring *</label>
              <input
                type="date"
                name="dateOfMentoring"
                value={formData.DateOfMentoring}
                onChange={(e) =>
                  setFormData({ ...formData, DateOfMentoring: e.target.value })
                }
                className={styles.input}
              />
            </div>

            {/* Attendance & Next Date */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Attendance Status *</label>
              <select
                name="attendanceStatus"
                value={formData.AttendanceStatus}
                onChange={(e) =>
                  setFormData({ ...formData, AttendanceStatus: e.target.value })
                }
                className={styles.select}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Next Mentoring Date</label>
              <input
                type="date"
                name="nextMentoringDate"
                value={formData.NextMentoringDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    NextMentoringDate: e.target.value,
                  })
                }
                className={styles.input}
              />
            </div>

            {/* Conditional Absent Remarks */}
            {formData.AttendanceStatus === "Absent" && (
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Absent Remarks *</label>
                <textarea
                  name="absentRemarks"
                  value={formData.AbsentRemarks}
                  onChange={(e) =>
                    setFormData({ ...formData, AbsentRemarks: e.target.value })
                  }
                  className={styles.textarea}
                  placeholder="Reason for absence..."
                  required
                />
              </div>
            )}

            {/* Meeting Core */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Mentoring Meeting Agenda</label>
              <input
                type="text"
                name="mentoringMeetingAgenda"
                value={formData.MentoringMeetingAgenda}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    MentoringMeetingAgenda: e.target.value,
                  })
                }
                className={styles.input}
                placeholder="Main agenda of the meeting"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Issues Discussed</label>
              <textarea
                name="issuesDiscussed"
                value={formData.IssuesDiscussed}
                onChange={(e) =>
                  setFormData({ ...formData, IssuesDiscussed: e.target.value })
                }
                className={styles.textarea}
                placeholder="Detail the issues discussed..."
              />
            </div>

            {/* Parent Section */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isParentPresent"
                  name="isParentPresent"
                  checked={formData.IsParentPresent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      IsParentPresent: e.target.checked,
                    })
                  }
                  className={styles.checkbox}
                />
                <label htmlFor="isParentPresent" className={styles.label}>
                  Is Parent Present?
                </label>
              </div>

              {formData.IsParentPresent && (
                <div className={styles.parentSection}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Parent Name</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.ParentName}
                      onChange={(e) =>
                        setFormData({ ...formData, ParentName: e.target.value })
                      }
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Parent Mobile No</label>
                    <input
                      type="tel"
                      name="parentMobileNo"
                      value={formData.ParentMobileNo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ParentMobileNo: e.target.value,
                        })
                      }
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Parent's Opinion</label>
                    <textarea
                      name="parentsOpinion"
                      value={formData.ParentsOpinion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ParentsOpinion: e.target.value,
                        })
                      }
                      className={styles.textarea}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Opinions */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Staff Opinion</label>
              <textarea
                name="staffOpinion"
                value={formData.StaffOpinion}
                onChange={(e) =>
                  setFormData({ ...formData, StaffOpinion: e.target.value })
                }
                className={styles.textarea}
              />
            </div>

            {/* Assessments */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Assessed Stress Level</label>
              <select
                name="stressLevel"
                value={formData.StressLevel}
                onChange={(e) =>
                  setFormData({ ...formData, StressLevel: e.target.value })
                }
                className={styles.select}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Learner Type</label>
              <select
                name="learnerType"
                value={formData.LearnerType}
                onChange={(e) =>
                  setFormData({ ...formData, LearnerType: e.target.value })
                }
                className={styles.select}
              >
                <option value="Visual">Visual</option>
                <option value="Auditory">Auditory</option>
                <option value="Kinesthetic">Kinesthetic</option>
                <option value="Reading/Writing">Reading/Writing</option>
              </select>
            </div>

            {/* Document Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Mentoring Document (Optional)
              </label>
              <input
                type="file"
                name="mentoringDocument"
                className={`${styles.input} ${styles.fileInput}`}
              />
            </div>

            {/* Description */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Additional Description / Next Steps
              </label>
              <textarea
                name="description"
                value={formData.Description}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
                className={styles.textarea}
              />
            </div>

            <div className={`${styles.actions} ${styles.fullWidth}`}>
              <button type="button" className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                Submit Record
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AttendMentoring;