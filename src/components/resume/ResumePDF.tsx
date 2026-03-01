import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import resumeData from "@/data/resume.json";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 pt solid #ccc",
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#111",
  },
  role: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  contact: {
    flexDirection: "row",
    gap: 15,
    fontSize: 9,
    color: "#555",
  },
  link: {
    color: "#0066cc",
    textDecoration: "none",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111",
    borderBottom: "1 pt solid #eee",
    paddingBottom: 4,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  jobBlock: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  jobTitle: {
    fontFamily: "Helvetica-Bold",
    color: "#111",
  },
  jobCompany: {
    fontFamily: "Helvetica-Bold",
    color: "#444",
  },
  jobDate: {
    color: "#666",
    fontSize: 9,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 8,
  },
  bullet: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  techStackRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
    paddingLeft: 8,
  },
  techPill: {
    backgroundColor: "#f4f4f5",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 8,
    color: "#555",
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    marginTop: 4,
  },
  skillList: {
    color: "#444",
  },
});

export const ResumePDF = () => {
  const { profile, work, education, skills } = resumeData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>
            {profile.role} • {profile.location}
          </Text>
          <View style={styles.contact}>
            <Link style={styles.link} src={`mailto:${profile.socials.email}`}>
              {profile.socials.email}
            </Link>
            <Link style={styles.link} src={profile.socials.github}>
              GitHub
            </Link>
            <Link style={styles.link} src={profile.socials.linkedin}>
              LinkedIn
            </Link>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {work.map((job) => (
            <View key={job.id} style={styles.jobBlock}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.jobTitle}>{job.position}</Text>
                  <Text style={styles.jobCompany}>
                    {job.company} • {job.location}
                  </Text>
                </View>
                <Text style={styles.jobDate}>{job.duration}</Text>
              </View>
              {job.description.map((desc, i) => (
                <View key={i} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{desc}</Text>
                </View>
              ))}
              <View style={styles.techStackRow}>
                {job.techStack.map((tech) => (
                  <Text key={tech} style={styles.techPill}>
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu, idx) => (
            <View key={idx} style={styles.jobBlock}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{edu.institution}</Text>
                <Text style={styles.jobDate}>{edu.duration}</Text>
              </View>
              <Text style={styles.jobCompany}>
                {edu.degree} {edu.grade ? `• ${edu.grade}` : ""}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skillCategory}>
            Languages:{" "}
            <Text style={styles.skillList}>{skills.languages.join(", ")}</Text>
          </Text>
          <Text style={styles.skillCategory}>
            Frameworks:{" "}
            <Text style={styles.skillList}>{skills.frameworks.join(", ")}</Text>
          </Text>
          <Text style={styles.skillCategory}>
            Databases & Tools:{" "}
            <Text style={styles.skillList}>
              {skills.databases.join(", ")}, {skills.tools.join(", ")}
            </Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};
