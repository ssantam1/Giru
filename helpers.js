async function updateScoreNickname(member, score) {
    const nickname = member.nickname || member.user.username;

    let newNickname = nickname;

    const scorePattern = /\s*\([^)]*\)$/; // regex pattern to match score in parentheses allowing any character except closing parenthesis
    newNickname = newNickname.replace(scorePattern, '');

    newNickname = `${newNickname} (${score})`;

    if (member.nickname !== newNickname) {
        await member.setNickname(newNickname);
    }
}

module.exports = { updateScoreNickname };